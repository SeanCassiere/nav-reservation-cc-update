import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";

import AppRoutes from "./routes/AppRoutes";
import ErrorSubmission from "./shared/pages/ErrorSubmission/ErrorSubmission";

import { selectTranslations } from "./shared/redux/store";
import { selectConfigState } from "./shared/redux/store";

const App = () => {
	const t = useSelector(selectTranslations);
	const { fromRentall } = useSelector(selectConfigState);
	return (
		<Container>
			<Row className='justify-content-lg-center' style={{ paddingTop: "1rem" }}>
				<Col xs={12} sm={12} md={12} lg={6}>
					<ErrorBoundary FallbackComponent={ErrorFallback}>
						<AppRoutes />
					</ErrorBoundary>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12}>
					<p style={{ padding: "1rem 0" }} className='text-center'>
						{t.footer.powered_by}&nbsp;
						<a
							href={fromRentall ? "https://rentallsoftware.com" : "https://navotar.com"}
							target='_blank'
							rel='noreferrer'
							className='text-primary'
						>
							{fromRentall ? "RENTALL" : "Navotar"}
						</a>
					</p>
				</Col>
			</Row>
		</Container>
	);
};

const ErrorFallback = () => {
	const t = useSelector(selectTranslations);
	return <ErrorSubmission msg={t.error_boundary.message} />;
};

export default App;
