"use client";
import Navbar from "@/app/(falcon)/(merlin)/components/Navbar";
import { plans } from "./plans";
import useUserData from "@/hooks/useUserData";
import UpgradeModal from "./BuyModal";

export default function Pricing() {
  const { user } = useUserData();
  return (
    <div className="h-screen w-screen bg-base-300">
      <Navbar />
      <section>
        <div className="px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="w-80 flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow xl:p-8"
              >
                <h3 className="mb-4 text-2xl font-semibold">{plan.title}</h3>
                <div className="flex justify-center items-baseline my-8">
                  <span className="mr-2 text-5xl font-extrabold">
                    {plan.price}
                  </span>
                  <span className="text-gray-500">{plan.duration}</span>
                </div>
                <UpgradeModal />
                <ul role="list" className="mb-8 space-y-4 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <svg
                        className="flex-shrink-0 w-5 h-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
