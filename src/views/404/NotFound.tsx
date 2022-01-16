import OlympusLogo from "../../assets/Olympus Logo.svg";
import "./notfound.scss";
import { Trans } from "@lingui/macro";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://cre8rdao.finance" target="_blank">
          <img className="branding-header-icon" src={OlympusLogo} alt="Cre8rDAO" />
        </a>

        <h4>
          <Trans>Page not found</Trans>
        </h4>
      </div>
    </div>
  );
}
