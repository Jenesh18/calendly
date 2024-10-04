import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
      <div className="lg:w-1/2">
        <h1 className="text-7xl font-extrabold gradient-title pb-6">
          Simplify Your Scheduling
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Schedulrr helps you manage your time effectively. Create events, set
          your availability, and let others book time with you seamlessly.
        </p>
        <Link href={"/dashboard"}>
          <Button size="lg" className="text-lg">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
      <div className="lg:w-1/2 flex justify-center">
        <div className="relative w-full max-w-md aspect-square">
          <Image
            src="/poster.png"
            alt="Scheduling illustration"
            fill // Use "fill" instead of "layout='fill'"
            style={{ objectFit: "contain" }} // Use style for objectFit
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
