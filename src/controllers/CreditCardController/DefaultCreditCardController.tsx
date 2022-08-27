import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import DefaultDynamicCreditCard from "../../components/DynamicCreditCard/DefaultCreditCard";
import DefaultCardDetailsForm from "../../components/DefaultCardDetailsForm/DefaultCardDetailsForm";
import Button from "../../components/Elements/Button";

import { useCreditCardLogic } from "../../hooks/logic/useCreditCardLogic";
import { useFormStore } from "../../hooks/stores/useFormStore";

interface IProps {
  handleSubmit: () => void;
  handlePrevious: () => void;
  isNextAvailable: boolean;
  isPrevPageAvailable: boolean;
}

const DefaultCreditCardController: React.FC<IProps> = ({
  handleSubmit,
  isNextAvailable,
  handlePrevious,
  isPrevPageAvailable,
}) => {
  const { t } = useTranslation();
  const initialFormData = useFormStore((s) => s.customerCreditCard.data);
  const setCustomerCreditCardToStore = useFormStore((s) => s.setCustomerCreditCard);

  const {
    validateCardData,
    handleCardInputChange,
    handleCardInputBlur,
    handleCardInputFocus,
    currentFocus,
    schemaErrors,
    formValues,
  } = useCreditCardLogic(initialFormData);

  // validate the form data against the schema
  const handleNextState = useCallback(async () => {
    await validateCardData((values) => {
      setCustomerCreditCardToStore(values);
      handleSubmit();
    });
  }, [handleSubmit, setCustomerCreditCardToStore, validateCardData]);

  return (
    <CardLayout title={t("forms.creditCard.title")} subtitle={t("forms.creditCard.message")}>
      <div className="mt-4 grid grid-cols-1">
        <div className="my-4 md:my-2">
          <DefaultDynamicCreditCard currentFocus={currentFocus} formData={formValues} />
        </div>
        <div className="mt-4">
          <DefaultCardDetailsForm
            formData={formValues}
            handleChange={handleCardInputChange}
            handleBlur={handleCardInputBlur}
            handleFocus={handleCardInputFocus}
            schemaErrors={schemaErrors}
          />
        </div>
        <div className="mt-6 flex">
          {isPrevPageAvailable && (
            <div>
              <Button color="primary" variant="muted" size="lg" onClick={handlePrevious}>
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

export default DefaultCreditCardController;
