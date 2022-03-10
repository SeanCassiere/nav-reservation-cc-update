import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";

import { selectConfigState, selectTranslations } from "../../redux/store";
import NotFoundImg from "../../assets/undraw_page_not_found_su7k.svg";

const NotAuthorized = () => {
	const config = useSelector(selectConfigState);
	const t = useSelector(selectTranslations);
	return (
		<Card border='light' style={{ width: "100%", padding: "2rem 1rem" }}>
			<Card.Img variant='top' alt='Not Found' src={NotFoundImg} />
			<Card.Body>
				<Card.Title>{t.query_missing.title}</Card.Title>
				<Card.Text>
					{t.query_missing.message}
					<br />
					{t.query_missing.report}&nbsp;
					<a
						href={config.fromRentall ? "mailto:support@rentallsoftware.com" : "mailto:support@navotar.com"}
						target='_blank'
						rel='noreferrer'
					>
						{config.fromRentall ? "support@rentallsoftware.com" : "support@navotar.com"}
					</a>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default NotAuthorized;
