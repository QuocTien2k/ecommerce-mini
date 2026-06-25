import {
  getOrderStatusLabel,
  getOrderStepIndex,
  ORDER_FLOW_TIMELINE,
} from "@shared/types/order-status";
import type { OrderStatus } from "../../types/order-status.type";
import { CheckCircle2, Circle, Truck } from "lucide-react";
import { cn } from "@lib/utils";

type Props = {
  status: OrderStatus;
};

const OrderTimeline = ({ status }: Props) => {
  const currentStep = getOrderStepIndex(status);

  const progressPercent =
    currentStep >= 0
      ? (currentStep / (ORDER_FLOW_TIMELINE.length - 1)) * 100
      : 0;

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-8 text-lg font-semibold">Tiến trình đơn hàng</h3>

      <div className="relative overflow-hidden">
        {/* Base line */}
        <div className="absolute top-5 left-0 h-1 w-full rounded-full bg-gray-200" />

        {/* Progress line */}
        <div
          className="absolute top-5 left-0 h-1 rounded-full bg-green-500 transition-all duration-700"
          style={{
            width: `${progressPercent}%`,
          }}
        />
        {currentStep < ORDER_FLOW_TIMELINE.length - 1 && (
          <div
            className="shipping-segment absolute top-5 h-1 rounded-full"
            style={{
              left: `${progressPercent}%`,
              width: `${100 / (ORDER_FLOW_TIMELINE.length - 1)}%`,
            }}
          />
        )}

        <div className="relative flex justify-between">
          {ORDER_FLOW_TIMELINE.map((step, index) => {
            const completed = index < currentStep;
            const current = index === currentStep;

            return (
              <div
                key={step}
                className="flex w-24 flex-col items-center text-center"
              >
                <div
                  className={cn(
                    "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white",
                    completed
                      ? "border-green-500 text-green-500"
                      : current
                        ? "border-primary text-primary"
                        : "border-gray-300 text-gray-300",
                  )}
                >
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : current ? (
                    <Truck className="delivery-truck h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5 fill-current" />
                  )}
                </div>

                <span
                  className={`
                mt-3 text-sm
                ${
                  completed
                    ? "text-green-600"
                    : current
                      ? "font-medium text-primary"
                      : "text-gray-400"
                }
              `}
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
