import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import Wrapper from "./Wrapper";
import MobileNavbar from "./MobileNavbar";
import { buttonVariants } from "./ui/button";
import UserAccountNav from "./UserAccountNav";
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";

export default function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <nav className="sticky h-16 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/20 backdrop-blur-lg transition-all">
      <Wrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40">
            <Image
              src="/logo.png"
              alt="logo"
              width={147}
              height={148}
              quality={100}
              className="rounded-lg w-10 h-10"
            />
          </Link>

          <MobileNavbar isAuth={!!user} />

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}>
                  Pricing
                </Link>
                <LoginLink
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}>
                  Login
                </LoginLink>
                <RegisterLink
                  className={buttonVariants({
                    size: "lg",
                  })}
                  target="_blank">
                  Get started <ArrowRight className="ml-2 h-5 w-5" />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}>
                  Dashboard
                </Link>
                <UserAccountNav
                  name={
                    !user.given_name || !user.family_name
                      ? "Your Account"
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ""}
                  imageURL={user.picture ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </Wrapper>
    </nav>
  );
}
