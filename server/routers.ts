import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createConversionJob, getConversionJob } from "./cloudconvert";
import { storagePresignPut } from "./storage";
import { createConversionJobRecord, getConversionJobRecord, updateConversionJobRecord } from "./db";

export const conversionInput = z.object({
  name: z.string().min(1).max(255),
  type: z.string().max(120),
  key: z.string().min(1).max(500),
});

export const conversionProcedureNames = ["initUpload", "createJob", "getJob"] as const;
export function resolvePersistedJobStatus(providerStatus: string, expiresAt?: Date | null, now = new Date()) { return expiresAt && expiresAt.getTime() < now.getTime() && providerStatus !== "finished" ? "expired" : providerStatus; }

export const uploadInitInput = z.object({ name: z.string().min(1).max(255), type: z.string().max(120) });
export const uploadInitResponse = z.object({ key: z.string().min(1), url: z.string().url() });

const conversionOptions = z.object({
  range: z.string().max(100).optional(),
  format: z.enum(["PNG", "JPG"]).optional(),
  compression: z.enum(["Balanced", "Maximum compression", "High quality"]).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  conversion: router({
    initUpload: publicProcedure
      .input(uploadInitInput)
      .output(uploadInitResponse)
      .mutation(({ input }) => storagePresignPut(`easypdf/input/${input.name}`, input.type || "application/octet-stream")),
    createJob: publicProcedure
      .input(z.object({
        tool: z.enum(["merge", "split", "compress", "pdf-to-image", "image-to-pdf"]),
        inputs: z.array(conversionInput).min(1).max(20),
        options: conversionOptions.optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createConversionJob(input.tool, input.inputs, input.options);
        const providerJob = result.data;
        await createConversionJobRecord({ providerJobId: providerJob.id, tool: input.tool, status: providerJob.status, inputKeys: JSON.stringify(input.inputs.map(file => file.key)), expiresAt: new Date(Date.now() + 60 * 60 * 1000) });
        return result;
      }),
    getJob: publicProcedure
      .input(z.object({ jobId: z.string().min(1).max(100) }))
      .query(async ({ input }) => {
        const result = await getConversionJob(input.jobId);
        const providerJob = result.data;
        const exportTask = providerJob.tasks?.find((task: any) => task.operation === "export/url");
        const resultUrls = exportTask?.result?.files?.filter((file: any) => file?.url).map((file: any) => file.url) ?? [];
        const persisted = await getConversionJobRecord(input.jobId);
        const persistedStatus = resolvePersistedJobStatus(providerJob.status, persisted?.expiresAt) as "waiting" | "processing" | "finished" | "error" | "expired";
        await updateConversionJobRecord(input.jobId, { status: persistedStatus, resultUrls: resultUrls.length ? JSON.stringify(resultUrls) : undefined, errorMessage: providerJob.message ?? undefined });
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
