import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  ALL_SCREEN_FLOWS,
  ALL_SUCCESS_SCREENS,
  APP_CONSTANTS,
  REPO_URL,
  ALL_FORM_SUMMARY_OPTIONS,
} from "../../utils/constants";
import { supportedLanguages } from "../../i18n";
import { isValueTrue } from "../../utils/common";
import { devConfigToQueryUrl } from "./utils";

import { useConfigStore } from "../../hooks/stores/useConfigStore";
import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";

import TextInput from "../Elements/Default/TextInput";
import CheckInput from "../Elements/Default/CheckInput";
import SelectInput from "../Elements/Default/SelectInput";
import AnchorLink from "../Elements/Default/AnchorLink";
import Button from "../Elements/Default/Button";
import CardLayout from "../../layouts/Card";

export type DevConfigObject = {
  referenceId: string;
  referenceType: string;
  lang: string;
  qa: boolean;
  dev: boolean;
  clientId: string;
  emailTemplateId: string;
  flow: string[];
  fromRentall: boolean;
  successSubmissionScreen: string;
  showPreSubmitSummary: boolean;
};

const outsideInitialConfigState: DevConfigObject = {
  referenceId: "0",
  referenceType: "Reservation",
  lang: "en",
  qa: false,
  dev: true,
  clientId: "0",
  emailTemplateId: "0",
  flow: [ALL_SCREEN_FLOWS[0].value],
  fromRentall: true,
  showPreSubmitSummary: false,
  successSubmissionScreen: APP_CONSTANTS.SUCCESS_DEFAULT,
};

const DeveloperDebugMenu: React.FC<{ open: boolean; handleClose: () => void }> = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      divRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div ref={divRef}>
      <CardLayout
        title={
          <div className="flex align-middle justify-center">
            <h1 className="flex-1">{t("developer.drawerTitle")}</h1>
            <div>
              <Button color="danger" size="sm" onClick={handleClose}>
                &times;
              </Button>
            </div>
          </div>
        }
      >
        <div className="mt-0 pt-0">
          <ConfigCreator />
        </div>
      </CardLayout>
    </div>
  );
};

const ConfigCreator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const SELECT_MENU_DEFAULT_KEY = t("developer.configCreator.formSelectValue");

  const { referenceIdentifier, referenceType, clientId, responseTemplateId } = useRuntimeStore();
  const { successSubmissionScreen, fromRentall, flow, qa, rawQueryString, showPreSubmitSummary } = useConfigStore();

  const [isReady, setIsReady] = React.useState(false);
  const [initialConfig, setInitialConfig] = React.useState<DevConfigObject>(outsideInitialConfigState);
  const [config, setConfig] = React.useState<DevConfigObject>(outsideInitialConfigState);

  const [showCopiedMessage, setShowCopiedMessage] = React.useState(false);

  // general input handler
  const handleNormalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "checkbox") {
      setConfig((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    } else {
      setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  // general select handler
  const handleSelectInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === SELECT_MENU_DEFAULT_KEY) {
      return;
    }
    setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // handle selecting the flow items
  const handleSelectFlowItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig((prev) => ({ ...prev, flow: [...prev.flow, e.target.value] }));
  };

  const handleRemoveFlowItem = (idx: number) => {
    if (config.flow.length === 1) {
      setConfig((prev) => ({ ...prev, flow: [ALL_SCREEN_FLOWS[0].value] }));
    } else {
      setConfig((prev) => ({
        ...prev,
        flow: [...prev.flow.slice(0, idx), ...prev.flow.slice(idx + 1)],
      }));
    }
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const queryStringUrl = devConfigToQueryUrl(config);
    window.location.href = window.location.origin + "/?" + queryStringUrl;
  };

  const handleReset = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setConfig(initialConfig);
  };

  React.useEffect(() => {
    const query = new URLSearchParams(rawQueryString);
    const dev = query.get("dev");
    const body = {
      referenceId: `${referenceIdentifier || 0}`,
      referenceType: `${referenceType}`,
      lang: i18n.language,
      qa: qa,
      dev: false,
      clientId: `${clientId || 0}`,
      emailTemplateId: `${responseTemplateId || 0}`,
      flow: [...flow],
      fromRentall: fromRentall,
      successSubmissionScreen: `${successSubmissionScreen}`,
      showPreSubmitSummary: showPreSubmitSummary ?? outsideInitialConfigState.showPreSubmitSummary,
    };
    setConfig((prev) => ({ ...prev, ...body, dev: Boolean(isValueTrue(dev)) }));
    setInitialConfig((prev) => ({ ...prev, ...body, dev: Boolean(isValueTrue(dev)) }));
    setIsReady(true);
  }, [
    clientId,
    flow,
    fromRentall,
    i18n.language,
    qa,
    rawQueryString,
    referenceIdentifier,
    referenceType,
    responseTemplateId,
    successSubmissionScreen,
    showPreSubmitSummary,
  ]);

  if (!isReady) {
    return <div>still loading...</div>;
  }

  return (
    <React.Fragment>
      <div className="pt-1 pb-3">
        <AnchorLink href={REPO_URL} rel="noreferrer" target="_blank" className="text-indigo-600">
          {t("developer.viewProjectRepo")}
        </AnchorLink>
      </div>
      <div className="p-2 rounded w-full bg-yellow-50 flex flex-col gap-1" style={{ overflowWrap: "anywhere" }}>
        <p className="m-0 text-sm text-gray-700">{window.location.origin + "/?" + devConfigToQueryUrl(config)}</p>
        <Button
          type="button"
          color="primary"
          variant="muted"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(window.location.origin + "/?" + devConfigToQueryUrl(config));
            setShowCopiedMessage(true);
            setTimeout(() => {
              setShowCopiedMessage(false);
            }, 1250);
          }}
        >
          {showCopiedMessage ? t("developer.configCreator.btnCopiedToClipboard") : t("developer.configCreator.btnCopy")}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">{t("developer.configCreator.referenceType")}</span>
          <div className="mt-1 flex flex-col gap-1">
            <CheckInput
              type="radio"
              name="referenceType"
              value={APP_CONSTANTS.REF_TYPE_RESERVATION}
              checked={config.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION}
              onChange={handleNormalInputChange}
              label={APP_CONSTANTS.REF_TYPE_RESERVATION}
            />
            <CheckInput
              type="radio"
              name="referenceType"
              value={APP_CONSTANTS.REF_TYPE_AGREEMENT}
              checked={config.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT}
              onChange={handleNormalInputChange}
              label={APP_CONSTANTS.REF_TYPE_AGREEMENT}
            />
          </div>
        </div>
        <div className="mb-4">
          <TextInput
            type="text"
            value={config.referenceId}
            name="referenceId"
            onChange={handleNormalInputChange}
            label={t("developer.configCreator.referenceId")}
            required
          />
        </div>
        <div className="mb-4">
          <div>
            <SelectInput
              value={config.lang}
              name="lang"
              required
              label={t("developer.configCreator.lang")}
              onChange={handleSelectInputChange}
            >
              <option>{SELECT_MENU_DEFAULT_KEY}</option>
              {supportedLanguages.map((langItem) => (
                <option value={langItem} key={`language-${langItem}`}>
                  {langItem}
                </option>
              ))}
            </SelectInput>
          </div>
        </div>
        <div className="mb-4">
          <TextInput
            type="number"
            value={config.clientId}
            name="clientId"
            onChange={handleNormalInputChange}
            min="0"
            label={t("developer.configCreator.clientId")}
            required
          />
        </div>
        <div className="mb-3">
          <TextInput
            type="number"
            value={config.emailTemplateId}
            name="emailTemplateId"
            onChange={handleNormalInputChange}
            min="0"
            label={t("developer.configCreator.responseTemplateId")}
            required
          />
        </div>
        <div className="mb-4">
          <SelectInput
            name="flow"
            onChange={handleSelectFlowItem}
            label={t("developer.configCreator.applicationFlows")}
          >
            {ALL_SCREEN_FLOWS.map((flowItem) => (
              <option value={flowItem.value} key={`select-flow-${flowItem.value}`}>
                {flowItem.label}
              </option>
            ))}
          </SelectInput>
          <div>
            <ol className="list-decimal ml-6 mt-3">
              {config.flow.map((flowItem, index) => (
                <li key={`flow-item-${flowItem}-${index}`}>
                  <div className="flex align-middle items-center gap-3 px-2 py-2 bg-gray-100 rounded my-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveFlowItem(index)}
                      className="bg-red-500 text-white text-sm h-5 aspect-square rounded-full flex align-middle justify-center"
                    >
                      &times;
                    </button>
                    <div className="flex-1 truncate">
                      <span className="font-medium text-sm">{flowItem}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mb-4">
          <SelectInput
            name="successSubmissionScreen"
            defaultValue={config.successSubmissionScreen}
            onChange={handleSelectInputChange}
            label={t("developer.configCreator.applicationSuccessScreen")}
          >
            {ALL_SUCCESS_SCREENS.map((successScreen) => (
              <option value={successScreen.value} key={`select-successSubmissionScreen-${successScreen.value}`}>
                {successScreen.label}
              </option>
            ))}
          </SelectInput>
        </div>
        {/*  */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="col-span-2 md:col-span-1">
            <span className="text-sm font-medium text-gray-700">
              {t("developer.configCreator.showPreSubmitSummary")}
            </span>
            <CheckInput
              type="checkbox"
              name="showPreSubmitSummary"
              checked={config.showPreSubmitSummary}
              onChange={handleNormalInputChange}
              label={config.showPreSubmitSummary ? t("developer.configCreator.yes") : t("developer.configCreator.no")}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <span className="text-sm font-medium text-gray-700">
              {t("developer.configCreator.applicationBranding")}
            </span>
            <CheckInput
              type="checkbox"
              name="fromRentall"
              checked={config.fromRentall}
              onChange={handleNormalInputChange}
              label={config.fromRentall ? "RENTALL" : "Navotar"}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <span className="text-sm font-medium text-gray-700">
              {t("developer.configCreator.applicationEnvironment")}
            </span>
            <CheckInput
              type="checkbox"
              name="qa"
              checked={config.qa}
              onChange={handleNormalInputChange}
              label={config.qa ? t("developer.configCreator.yes") : t("developer.configCreator.no")}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <span className="text-sm font-medium text-gray-700">{t("developer.configCreator.openedDevMenu")}</span>
            <CheckInput
              type="checkbox"
              name="dev"
              checked={config.dev}
              onChange={handleNormalInputChange}
              label={config.dev ? t("developer.configCreator.yes") : t("developer.configCreator.no")}
            />
          </div>
        </div>
        <div className="mt-6 w-full flex gap-1">
          <Button type="submit" className="py-2 px-4 bg-gray-300">
            {t("developer.configCreator.btnSave")}
          </Button>
          <Button type="button" color="primary" variant="muted" className="py-2 px-4 bg-teal-300" onClick={handleReset}>
            {t("developer.configCreator.btnReset")}
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default DeveloperDebugMenu;
