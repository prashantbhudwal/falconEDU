import { plans } from "./plans";
import UpgradeModal from "./UpgradeModal";
export default function PlansGrid() {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 lg:px-6 lg:py-16">
        <div className="space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="mx-auto flex w-80 max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow xl:p-8"
            >
              <h3 className="mb-4 text-2xl font-semibold">{plan.title}</h3>
              <div className="my-8 flex items-baseline justify-center">
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
                      className="h-5 w-5 shrink-0 text-green-500"
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
  );
}
