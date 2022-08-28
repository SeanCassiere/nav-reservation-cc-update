import React, { memo, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

import Button from "../../components/Elements/Button";
import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";

import { APP_CONSTANTS } from "../../utils/constants";

const DefaultRentalSignatureController = lazy(
  () => import("../RentalSignatureController/DefaultRentalSignatureController")
);
const DefaultCreditCardController = lazy(() => import("../CreditCardController/DefaultCreditCardController"));
const DefaultLicenseUploadController = lazy(() => import("../LicenseUploadController/DefaultLicenseUploadController"));
const DefaultCreditCardAndLicenseUploadController = lazy(
  () => import("../CreditCardAndLicenseUploadController/DefaultCreditCardAndLicenseUploadController")
);
const DefaultRentalSummaryController = lazy(() => import("../RentalSummaryController/DefaultRentalSummaryController"));

interface IProps {
  selectedController: string | null;
  handleNext: () => void;
  handlePrevious: () => void;
  isNextPageAvailable: boolean;
  isPrevPageAvailable: boolean;
}

const DisplayCurrentController = ({
  selectedController,
  handleNext,
  isNextPageAvailable,
  handlePrevious,
  isPrevPageAvailable,
}: IProps) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Suspense fallback={<LoadingSubmission title={t("appStatusMessages.loading")} />}>
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_FORM && (
          <DefaultCreditCardController
            handleSubmit={handleNext}
            isNextAvailable={isNextPageAvailable}
            handlePrevious={handlePrevious}
            isPrevPageAvailable={isPrevPageAvailable}
          />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_LICENSE_UPLOAD_FORM && (
          <DefaultLicenseUploadController
            handleSubmit={handleNext}
            isNextAvailable={isNextPageAvailable}
            handlePrevious={handlePrevious}
            isPrevPageAvailable={isPrevPageAvailable}
          />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_CONTROLLER ||
        selectedController === APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_FORM ? (
          <DefaultCreditCardAndLicenseUploadController
            handleSubmit={handleNext}
            isNextAvailable={isNextPageAvailable}
            handlePrevious={handlePrevious}
            isPrevPageAvailable={isPrevPageAvailable}
          />
        ) : null}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_RENTAL_SIGNATURE_FORM && (
          <DefaultRentalSignatureController
            handleSubmit={handleNext}
            isNextAvailable={isNextPageAvailable}
            handlePrevious={handlePrevious}
            isPrevPageAvailable={isPrevPageAvailable}
          />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_RENTAL_CHARGES_FORM && (
          <DefaultRentalSummaryController
            handleSubmit={handleNext}
            isNextAvailable={isNextPageAvailable}
            handlePrevious={handlePrevious}
            isPrevPageAvailable={isPrevPageAvailable}
          />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEV_SCREEN_1 && (
          <div>
            <h5>{APP_CONSTANTS.VIEW_DEV_SCREEN_1}</h5>
            <div className="flex gap-1">
              <Button
                type="button"
                color="primary"
                variant="muted"
                disabled={!isPrevPageAvailable}
                onClick={handlePrevious}
              >
                &#8592;
              </Button>
              <Button type="button" onClick={handleNext}>
                {isNextPageAvailable ? t("forms.navNext") : t("forms.navSubmit")}
              </Button>
            </div>
          </div>
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEV_SCREEN_2 && (
          <div>
            <h5>{APP_CONSTANTS.VIEW_DEV_SCREEN_2}</h5>
            <div className="flex gap-1">
              <Button
                type="button"
                color="primary"
                variant="muted"
                disabled={!isPrevPageAvailable}
                onClick={handlePrevious}
              >
                &#8592;
              </Button>
              <Button type="button" onClick={handleNext}>
                {isNextPageAvailable ? t("forms.navNext") : t("forms.navSubmit")}
              </Button>
            </div>
          </div>
        )}
      </Suspense>
    </React.Fragment>
  );
};

export default memo(DisplayCurrentController);