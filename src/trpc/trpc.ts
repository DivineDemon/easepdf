import { TRPCError, initTRPC } from "@trpc/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (options) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user.id || !user.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return options.next({
    ctx: {
      userId: user.id,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
