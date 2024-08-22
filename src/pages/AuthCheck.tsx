"use-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck = (props: any) => {
  const router = useRouter();

  let isAuth: any = "";
  if (typeof window !== "undefined") {
    isAuth = sessionStorage.getItem("isAuth");
  }
  useEffect(() => {
    console.log("isAuth", isAuth);
    if (!isAuth || isAuth !== "true") {
      router.push("/");
    }
  }, [isAuth]);

  return <>{props.children}</>;
};

export default AuthCheck;
