import React from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import Button from "../../components/Elements/Button";
import DefaultRentalSummary from "../../components/RentalSummary/DefaultRentalSummary";

import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";
import { APP_CONSTANTS } from "../../utils/constants";

interface IProps {
  handleSubmit: () => void;
  handlePrevious: () => void;
  isNextAvailable: boolean;
  isPrevPageAvailable: boolean;
}

const DefaultRentalSummaryController: React.FC<IProps> = ({
  handleSubmit,
  handlePrevious,
  isNextAvailable,
  isPrevPageAvailable,
}) => {
  const { t } = useTranslation();
  const clientId = useRuntimeStore((s) => s.clientId);
  const referenceId = useRuntimeStore((s) => s.referenceIdentifier);
  const referenceType = useRuntimeStore((s) => s.referenceType);

  return (
    <CardLayout
      title={t("forms.rentalSummary.title", {
        context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
      })}
      subtitle={t("forms.rentalSummary.message", {
        context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
      })}
    >
      <div className="mt-3">
        <DefaultRentalSummary clientId={clientId ?? 0} referenceId={referenceId ?? 0} referenceType={referenceType} />
        <div className="mt-6 flex">
          {isPrevPageAvailable && (
            <div className="pr-0">
              <Button color="primary" variant="muted" size="lg" onClick={handlePrevious}>
                &#8592;
              </Button>
            </div>
          )}
          <div className={isPrevPageAvailable ? "pl-2 flex-1" : "flex-1"}>
            <Button color="primary" size="lg" onClick={handleSubmit}>
              {isNextAvailable ? t("forms.navNext") : t("forms.navSubmit")}
            </Button>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default DefaultRentalSummaryController;