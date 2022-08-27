import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import Alert from "../../components/Elements/Alert";
import DefaultImageDropzoneWithPreview from "../../components/DefaultImageDropzoneWithPreview/DefaultImageDropzoneWithPreview";
import Button from "../../components/Elements/Button";

import { useDriverLicenseLogic } from "../../hooks/logic/useDriverLicenseLogic";
import { useFormStore } from "../../hooks/stores/useFormStore";

interface IProps {
  handleSubmit: () => void;
  handlePrevious: () => void;
  isNextAvailable: boolean;
  isPrevPageAvailable: boolean;
}

const DefaultLicenseUploadController: React.FC<IProps> = ({
  handleSubmit,
  handlePrevious,
  isNextAvailable,
  isPrevPageAvailable,
}) => {
  const { t } = useTranslation();

  const clearFormState = useFormStore((s) => s.clearFormStateKey);
  const setDriversLicenseToStore = useFormStore((s) => s.setDriversLicense);
  const initialDriverLicenseData = useFormStore((s) => s.driversLicense.data);

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

  // General component state
  const handleNextState = useCallback(() => {
    if (!frontLicenseImage) setFrontImageError(true);
    if (!backLicenseImage) setBackImageError(true);
    if (!frontLicenseImage || !backLicenseImage) return;

    setDriversLicenseToStore({
      frontImageUrl: URL.createObjectURL(frontLicenseImage),
      backImageUrl: URL.createObjectURL(backLicenseImage),
      frontImageName: frontLicenseImage.name,
      backImageName: backLicenseImage.name,
    });
    handleSubmit();
  }, [
    frontLicenseImage,
    backLicenseImage,
    setFrontImageError,
    setBackImageError,
    setDriversLicenseToStore,
    handleSubmit,
  ]);

  const handleOpenModalConfirmation = useCallback(() => {
    if (
      (backLicenseImage || frontLicenseImage) &&
      window.confirm(t("forms.licenseUpload.goBack.title") + "\n" + t("forms.licenseUpload.goBack.message"))
    ) {
      clearFormState("driversLicense");
      handlePrevious();
    }

    if (!backLicenseImage && !frontLicenseImage) {
      handlePrevious();
    }
  }, [backLicenseImage, clearFormState, frontLicenseImage, handlePrevious, t]);

  return (
    <CardLayout title={t("forms.licenseUpload.title")} subtitle={t("forms.licenseUpload.message")}>
      <div className="mt-3 grid grid-cols-1 gap-4">
        <div>
          <h2 className="text-base text-gray-500 mb-2">{t("forms.licenseUpload.frontImage.title")}</h2>
          <div>
            {noFrontImageError && (
              <Alert variant="danger" fullWidth>
                {t("forms.licenseUpload.frontImage.notSelected")}
              </Alert>
            )}

            <DefaultImageDropzoneWithPreview
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
            />
          </div>
        </div>
        <div className="mt-2">
          <hr />
        </div>
        <div className="mt-2">
          <h2 className="text-base text-gray-500 mb-2">{t("forms.licenseUpload.backImage.title")}</h2>
          <div>
            {noBackImageError && (
              <Alert variant="danger" fullWidth>
                {t("forms.licenseUpload.backImage.notSelected")}
              </Alert>
            )}
            <DefaultImageDropzoneWithPreview
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
            />
          </div>
        </div>
        <div className="mt-1 flex">
          {isPrevPageAvailable && (
            <div className="pr-0">
              <Button color="primary" variant="muted" size="lg" onClick={handleOpenModalConfirmation}>
                &#8592;
              </Button>
            </div>
          )}
          <div className={isPrevPageAvailable ? "pl-2 flex-1" : "flex-1"}>
            <Button color="primary" size="lg" onClick={handleNextState}>
              {isNextAvailable ? t("forms.navNext") : t("forms.navSubmit")}
            </Button>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};
export default DefaultLicenseUploadController;
