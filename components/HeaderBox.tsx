"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderBoxProps } from "@/types";

const HeaderBox = ({
  type = "title",
  title,
  subtext,
  user,
}: HeaderBoxProps) => {
  return (
    <div className="header-box">
      <Card className="flex-shrink-1 bg-black-1 bg-opacity-75 border-black-1 shadow-xl ">
        <CardHeader>
          <CardTitle className="header-box-title">
            {title}
            {type === "greeting" && (
              <span className="text-bankGradient">&nbsp;{user}</span>
            )}
            ?
          </CardTitle>
          <p className="header-box-subtext">{subtext}</p>
        </CardHeader>
      </Card>
    </div>
  );
};

export default HeaderBox;
