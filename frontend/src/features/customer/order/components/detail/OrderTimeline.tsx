import { getOrderStepIndex, ORDER_TIMELINE } from "@shared/types/order-status";
import type { OrderStatus } from "../../types/order-status.type";
import { CheckCircle2, Circle } from "lucide-react";

type Props = {
  status: OrderStatus;
};

const OrderTimeline = ({ status }: Props) => {
  const currentStep = getOrderStepIndex(status);

  console.log(ORDER_TIMELINE);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Tiến trình đơn hàng</h3>

      <div className="space-y-0">
        {ORDER_TIMELINE.map((step, index) => {
          const completed = index < currentStep;
          const current = index === currentStep;
          const isLast = index === ORDER_TIMELINE.length - 1;

          return (
            <div key={step.status} className="flex gap-3">
              <div className="flex flex-col items-center">
                {completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : current ? (
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}

                {!isLast && <div className="mt-1 h-8 w-px bg-gray-200" />}
              </div>

              <div className="pb-8">
                <p
                  className={
                    current
                      ? "font-medium text-blue-600"
                      : completed
                        ? "text-green-600"
                        : "text-muted-foreground"
                  }
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
