import { auth, signIn } from "../../auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage() {
  const session = await auth();
  
  if (session?.user) {
    if ((session.user as any).role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/");
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Admin Login</h3>
          <p className="text-sm text-gray-500">Sign in with email and password</p>
        </div>
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
          className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
        >
          <div>
            <Label htmlFor="email" className="block text-xs text-gray-600 uppercase">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@berkay.com"
              autoComplete="email"
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <Label htmlFor="password" className="block text-xs text-gray-600 uppercase">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <Button type="submit">Sign In</Button>
        </form>
      </div>
    </div>
  );
}
