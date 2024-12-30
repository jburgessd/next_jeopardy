import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return (
    <main className="flex items-center justify-center h-screen w-screen bg-blue-heather bg-cover bg-center font-korinna">
      <SignUp />
    </main>
  );
};

export default Page;
