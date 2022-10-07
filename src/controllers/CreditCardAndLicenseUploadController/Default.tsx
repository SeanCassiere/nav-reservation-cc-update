import React, { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";

import CardLayout, { CardTitleHeading, CardSubtitleSpan } from "../../layouts/Card";
import Button from "../../components/Elements/Default/Button";
import Alert from "../../components/Elements/Default/Alert";
import ImageDropzoneWithPreviewDefault from "../../components/ImageDropzoneWithPreview/Default";
import DynamicCreditCardDefault from "../../components/DynamicCreditCard/Default";
import CreditCardFormDefault from "../../components/CreditCardForm/Default";
import { GoBackConfirmationDialog } from "../../components/Dialogs";

import { useCreditCardLogic } from "../../hooks/logic/useCreditCardLogic";
import { useDriverLicenseLogic } from "../../hooks/logic/useDriverLicenseLogic";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useDialogStore } from "../../hooks/stores/useDialogStore";
import { useAppNavContext } from "../../hooks/logic/useAppNavContext";

interface IProps {}

const DefaultCreditCardAndLicenseUploadController: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const clearFormState = useFormStore((s) => s.clearFormStateKey);
  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext, mode } = useAppNavContext();

  const setDriversLicenseToStore = useFormStore((s) => s.setDriversLicense);
  const setCustomerCreditCardToStore = useFormStore((s) => s.setCustomerCreditCard);
  const initialCreditCardFormData = useFormStore((s) => s.customerCreditCard.data);
  const initialDriverLicenseData = useFormStore((s) => s.driversLicense.data);
  const { setBackConfirmationDialogState, isBackConfirmationDialogOpen } = useDialogStore();

  // credit card relate handlers
  const {
    validateCardData,
    handleCardInputChange,
    handleCardInputBlur,
    handleCardInputFocus,
    isValidCheck: isCreditCardValid,
    currentFocus,
    schemaErrors,
    formValues,
  } = useCreditCardLogic(initialCreditCardFormData);

  // license related handlers
  const {
    frontLicenseImage,
    backLicenseImage,
    setFrontImageError,
    setBackImageError,
    noFrontImageError,
    noBackImageError,
    setFrontImage,
    setBackImage,
    clearFrontImage,
    clearBackImage,
  } = useDriverLicenseLogic({
    frontImageDataUrl: initialDriverLicenseData.frontImageUrl,
    frontImageName: initialDriverLicenseData.frontImageName,
    backImageDataUrl: initialDriverLicenseData.backImageUrl,
    backImageName: initialDriverLicenseData.backImageName,
  });

  // validate the form data against the schema
  const handleNextState = useCallback(async () => {
    const formValid = await isCreditCardValid();
    if (!frontLicenseImage) setFrontImageError(true);
    if (!backLicenseImage) setBackImageError(true);

    if (!backLicenseImage || !frontLicenseImage || !formValid) {
      return;
    }
    await validateCardData((values) => {
      setCustomerCreditCardToStore(values);
    });
    setDriversLicenseToStore({
      frontImageUrl: URL.createObjectURL(frontLicenseImage),
      backImageUrl: URL.createObjectURL(backLicenseImage),
      frontImageName: frontLicenseImage.name,
      backImageName: backLicenseImage.name,
    });

    goNext();
  }, [
    backLicenseImage,
    frontLicenseImage,
    goNext,
    isCreditCardValid,
    validateCardData,
    setBackImageError,
    setFrontImageError,
    setCustomerCreditCardToStore,
    setDriversLicenseToStore,
  ]);

  const dismissBackDialog = useCallback(() => {
    setBackConfirmationDialogState(false);
  }, [setBackConfirmationDialogState]);

  const confirmBackDialog = useCallback(() => {
    if (mode === "navigate") {
      clearFormState("driversLicense");
    }
    setBackConfirmationDialogState(false);
    goPrev();
  }, [clearFormState, goPrev, mode, setBackConfirmationDialogState]);

  const handleOpenModalConfirmation = useCallback(() => {
    if (mode === "save") {
      // if (initialDriverLicenseData.frontImageName !== frontLicenseImage.name) || (initialDriverLicenseData.backImageName !== backLicenseImage.name), then open modal
      if (
        initialDriverLicenseData.frontImageName !== frontLicenseImage?.name ||
        initialDriverLicenseData.backImageName !== backLicenseImage?.name
      ) {
        setBackConfirmationDialogState(true);
        return;
      }

      // if (initialDriverLicenseData.frontImageName === frontLicenseImage.name && initialDriverLicenseData.backImageName === backLicenseImage.name) then go back
      goPrev();
      return;
    }

    if (mode === "navigate") {
      // if (frontImageFile || backImageFile), then open modal
      if (backLicenseImage || frontLicenseImage) {
        setBackConfirmationDialogState(true);
        return;
      }

      // if (!frontImageFile && !backImageFile), then go back
      goPrev();
    }
  }, [
    backLicenseImage,
    frontLicenseImage,
    goPrev,
    initialDriverLicenseData.backImageName,
    initialDriverLicenseData.frontImageName,
    mode,
    setBackConfirmationDialogState,
  ]);

  return (
    <Fragment>
      <GoBackConfirmationDialog
        isOpen={isBackConfirmationDialogOpen}
        title={t("forms.licenseUpload.goBack.title")}
        message={t("forms.licenseUpload.goBack.message")}
        onCancel={dismissBackDialog}
        onConfirm={confirmBackDialog}
        cancelBtnText={t("forms.licenseUpload.goBack.cancel")}
        confirmBtnText={t("forms.licenseUpload.goBack.submit")}
      />
      <CardLayout>
        {/* Credit card form */}
        <div>
          <CardTitleHeading>{t("forms.creditCard.title")}</CardTitleHeading>
          <CardSubtitleSpan>{t("forms.creditCard.message")}</CardSubtitleSpan>
          <div className="mt-4 grid grid-cols-1">
            <div className="my-4 md:my-2">
              <DynamicCreditCardDefault currentFocus={currentFocus} formData={formValues} />
            </div>
            <div className="mt-4">
              <CreditCardFormDefault
                formData={formValues}
                handleChange={handleCardInputChange}
                handleBlur={handleCardInputBlur}
                handleFocus={handleCardInputFocus}
                schemaErrors={schemaErrors}
              />
            </div>
          </div>
        </div>
        {/* License Upload Form */}
        <div className="mt-7">
          <hr />
        </div>
        <div className="pt-5">
          <CardTitleHeading>{t("forms.licenseUpload.title")}</CardTitleHeading>
          <CardSubtitleSpan>{t("forms.licenseUpload.message")}</CardSubtitleSpan>
          <div className="d-grid mt-4">
            <div>
              <h2 className="mb-2 text-base text-gray-500">{t("forms.licenseUpload.frontImage.title")}</h2>
              <div>
                {noFrontImageError && <Alert variant="danger">{t("forms.licenseUpload.frontImage.notSelected")}</Alert>}

                <ImageDropzoneWithPreviewDefault
                  dragDisplayText={t("forms.licenseUpload.frontImage.drag")}
                  selectButtonText={t("forms.licenseUpload.frontImage.select")}
                  clearButtonText={t("forms.licenseUpload.frontImage.clear")}
                  onSelectFile={setFrontImage}
                  onClearFile={clearFrontImage}
                  acceptOnly={{
                    "image/jpeg": [".jpeg"],
                    "image/jpg": [".jpg"],
                    "image/png": [".png"],
                  }}
                  initialPreview={
                    initialDriverLicenseData.frontImageUrl
                      ? {
                          fileName: initialDriverLicenseData.frontImageName!,
                          url: initialDriverLicenseData.frontImageUrl,
                        }
                      : null
                  }
                  navMode={mode}
                />
              </div>
            </div>
            <div className="mt-6">
              <h2 className="mb-2 text-base text-gray-500">{t("forms.licenseUpload.backImage.title")}</h2>
              <div>
                {noBackImageError && <Alert variant="danger">{t("forms.licenseUpload.backImage.notSelected")}</Alert>}
                <ImageDropzoneWithPreviewDefault
                  dragDisplayText={t("forms.licenseUpload.backImage.drag")}
                  selectButtonText={t("forms.licenseUpload.backImage.select")}
                  clearButtonText={t("forms.licenseUpload.backImage.clear")}
                  onSelectFile={setBackImage}
                  onClearFile={clearBackImage}
                  acceptOnly={{
                    "image/jpeg": [".jpeg"],
                    "image/jpg": [".jpg"],
                    "image/png": [".png"],
                  }}
                  initialPreview={
                    initialDriverLicenseData.backImageUrl
                      ? {
                          fileName: initialDriverLicenseData.backImageName!,
                          url: initialDriverLicenseData.backImageUrl,
                        }
                      : null
                  }
                  navMode={mode}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="mt-6 flex">
          {isPreviousAvailable && (
            <div className="pr-0">
              <Button color="primary" variant="muted" size="lg" onClick={handleOpenModalConfirmation}>
                {prevPageText}
              </Button>
            </div>
          )}
          <div className={isPreviousAvailable ? "flex-1 pl-2" : "flex-1"}>
            <Button color="primary" size="lg" onClick={handleNextState}>
              {nextPageText}
            </Button>
          </div>
        </div>
      </CardLayout>
    </Fragment>
  );
};

export default DefaultCreditCardAndLicenseUploadController;
