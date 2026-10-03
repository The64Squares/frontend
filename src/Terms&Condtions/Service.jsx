import React from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import "./Service.css";

const servicesData = [
  {
    id: 1,
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "Express Delivery",
    info: "Ships in 24 Hours • Insured",
  },
  {
    id: 2,
    icon: <WorkspacePremiumOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "Brand Warranty",
    info: "100% Authentic Handcrafted",
  },
  {
    id: 3,
    icon: <LoyaltyOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "Exciting Deals",
    info: "Special perks on prepaid orders",
  },
  {
    id: 4,
    icon: <CreditCardOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "Secure Payments",
    info: "SSL / 256-Bit Encrypted",
  },
];

const Services = () => {
  return (
    <section className="the64squares-services-section" aria-label="Store Guarantees & Services">
      <div className="the64squares-services-container">
        <div className="the64squares-services-grid">
          {servicesData.map((item) => (
            <div className="the64squares-service-card" key={item.id}>
              <div className="the64squares-service-icon-box">
                {item.icon}
              </div>
              <div className="the64squares-service-content">
                <h3 className="the64squares-service-title">{item.title}</h3>
                <p className="the64squares-service-info">{item.info}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
