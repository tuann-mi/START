"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook, faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import michiganGlobalLogo from "../../../public/MichiganGlobal-logo-Icon.svg";
import Image from "next/image";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  console.log("router: ", router);
  console.log("router.query: ", router.query);
  console.log("router.asPath: ", router.asPath);
  console.log("session: ", session);
  console.log("status: ", status);
  console.log("pathname: ", pathname);

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-md p-8 rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Sign in to your account to continue
        </h1>
        <button
          onClick={() =>
            (window.location.href =
              "https://milogin.michigan.gov/eai/login/authenticate?PolicyId=urn:ibm:security:authentication:asf:basicldapuser&Target=https%3A%2F%2Fmiloginci.michigan.gov%2Foidc%2Fendpoint%2Fdefault%2Fauthorize%3FqsId%3D75ecd87a-1cba-431a-b801-e813edbe6d03%26client_id%3D28d60358-8345-4827-9a4d-de796b4159c7")
          }
          // className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition duration-300 ease-in-out w-full mb-4 flex items-center justify-center"
          className="michigan-global-button flex items-center justify-center w-full mb-4 px-4 py-2 rounded-md text-white transition duration-300 ease-in-out"
        >
          <Image src={michiganGlobalLogo} alt="Michigan Global Logo" width={24} height={24} className="mr-2" />
          Sign in with MiLogin
        </button>
        <button
          onClick={() => signIn("google")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out w-full"
        >
          <FontAwesomeIcon icon={faGoogle} className="mr-2" />
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("X", { callbackUrl: router.query.callbackUrl })}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out w-full mt-4"
        >
          <FontAwesomeIcon icon={faXTwitter} className="mr-2" />
          Sign in with X
        </button>
        <button
          onClick={() => signIn("github", { callbackUrl: router.query.callbackUrl })}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out w-full mt-4"
        >
          <FontAwesomeIcon icon={faGithub} className="mr-2" />
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
