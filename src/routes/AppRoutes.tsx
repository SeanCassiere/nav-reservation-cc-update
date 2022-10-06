import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import RequireAuth from "./RequireAuth";
import LoadingSubmission from "../pages/LoadingSubmission/LoadingSubmission";
import NotAuthorized from "../pages/NotAuthorized/NotAuthorized";
import ApplicationController from "../controllers/ApplicationController/ApplicationController";
import SuccessSubmissionPage from "../pages/SuccessSubmission/SuccessSubmission";
import ErrorSubmission from "../pages/ErrorSubmission/ErrorSubmission";
import NavigateToNotAvailable from "./NavigateToNotAvailable";

const PostFormDataController = lazy(() => import("../controllers/PostFormDataController/Default"));

const AppRoutes: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ApplicationController />} />
        <Route
          path="/submit-details"
          element={
            <RequireAuth>
              <Suspense fallback={<LoadingSubmission title={t("appStatusMessages.loading")} />}>
                <PostFormDataController />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/success"
          element={
            <RequireAuth>
              <SuccessSubmissionPage />
            </RequireAuth>
          }
        />
        <Route
          path="/error"
          element={
            <ErrorSubmission
              msg={t("badSubmission.message")}
              tryAgainButton
              tryAgainButtonText={t("badSubmission.btnRetrySubmission", {})}
            />
          }
        />
        <Route path="/not-available" element={<NotAuthorized />} />
        <Route path="*" element={<NavigateToNotAvailable />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
