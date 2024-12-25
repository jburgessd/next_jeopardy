"use client";

import { Card } from "@/components/ui/card";
import { UserProfile } from "@clerk/nextjs";

const ProfilePage = () => {
  return (
    <section className="home">
      <div className="home-content">
        <Card className="flex flex-col justify-center items-center rounded-lg [perspective:1000px] w-full h-full border-3 border-black-0 bg-blue-heather p-10 no-visible-scrollbar">
          <div className="absolute flex items-center space-x-2 top-10">
            <UserProfile routing="hash" />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ProfilePage;
