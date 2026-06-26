import {
  getOrderStatusLabel,
  getOrderStepIndex,
  ORDER_FLOW_TIMELINE,
} from "@shared/types/order-status.utils";
import { CheckCircle2, Circle, Truck } from "lucide-react";
import { cn } from "@lib/utils";
import type { OrderStatus } from "@shared/types/order-status.type";

type Props = {
  status: OrderStatus;
};

const OrderTimeline = ({ status }: Props) => {
  const currentStep = getOrderStepIndex(status);

  const progressPercent =
    currentStep >= 0
      ? (currentStep / (ORDER_FLOW_TIMELINE.length - 1)) * 100
      : 0;

  const segmentPercent = 100 / (ORDER_FLOW_TIMELINE.length - 1);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
      <h3 className="mb-8 text-lg font-semibold">Tiến trình đơn hàng</h3>

      <div className="relative">
        {/* Base line */}
        <div className="absolute top-4 left-[8.333%] right-[8.333%] h-1 rounded-full bg-gray-200" />

        {/* Completed line */}
        <div
          className="absolute top-4 left-[8.333%] h-1 rounded-full bg-green-500 transition-all duration-700"
          style={{
            width: `calc(${progressPercent}% * 0.8333)`,
          }}
        />

        {/* Animated shipping */}
        {currentStep >= 0 && currentStep < ORDER_FLOW_TIMELINE.length - 1 && (
          <div
            className="shipping-segment absolute top-4 h-1 rounded-full"
            style={{
              left: `calc(8.333% + ${progressPercent}% * 0.8333)`,
              width: `calc(${segmentPercent}% * 0.8333)`,
            }}
          />
        )}

        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${ORDER_FLOW_TIMELINE.length}, minmax(0,1fr))`,
          }}
        >
          {ORDER_FLOW_TIMELINE.map((step, index) => {
            const completed = index < currentStep;
            const current = index === currentStep;

            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={cn(
                    "z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white sm:h-10 sm:w-10",
                    completed
                      ? "border-green-500 text-green-500"
                      : current
                        ? "border-primary text-primary"
                        : "border-gray-300 text-gray-300",
                  )}
                >
                  {completed ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : current ? (
                    <Truck className="delivery-truck h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Circle className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
                  )}
                </div>

                <span
                  className={cn(
                    "mt-2 px-1 text-center text-[10px] leading-4 sm:text-sm",
                    completed
                      ? "text-green-600"
                      : current
                        ? "font-medium text-primary"
                        : "text-gray-400",
                  )}
                >
                  {getOrderStatusLabel(step)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
