import SetPassword from "@/components/auth/set-password";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10  bg-accent">
      <div className="w-full max-w-sm">
        <SetPassword />
      </div>
    </div>
  );
}
