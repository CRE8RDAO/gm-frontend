import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import { ReactComponent as OlympusIcon } from "../../assets/icons/basicLogo.svg";
import { ReactComponent as PoolTogetherIcon } from "../../assets/icons/33-together.svg";
import { ReactComponent as ZapIcon } from "../../assets/icons/zap.svg";
import { ReactComponent as NewIcon } from "../../assets/icons/new-icon.svg";
import { ReactComponent as WrapIcon } from "../../assets/icons/wrap.svg";
import { ReactComponent as BridgeIcon } from "../../assets/icons/bridge.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { Trans } from "@lingui/macro";
import { trim, shorten } from "../../helpers";
import { useAddress } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { Paper, Link, Box, Typography, SvgIcon, Divider } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import { useSelector } from "react-redux";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const networkId = useSelector(state => state.network.networkId);
  const { bonds } = useBonds(networkId);

  const checkPage = useCallback((_, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    return currentPath.indexOf(page) >= 0;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://cre8r.vip" target="_blank">
              <SvgIcon
                color="primary"
                component={OlympusIcon}
                viewBox="0 0 150 150"
                style={{ width: 150, height: 150 }}
              />
            </Link>

            {address && (
              <div className="wallet-link">
                <Link href={`https://testnet.ftmscan.com/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {(networkId === 1 || networkId === 4 || networkId === 250 || networkId === 4002) && (
                <>
                  <Link
                    component={NavLink}
                    id="dash-nav"
                    to="/dashboard"
                    isActive={(match, location) => {
                      return checkPage(match, location, "dashboard");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={DashboardIcon} />
                      <Trans>Dashboard</Trans>
                    </Typography>
                  </Link>

                  <Link
                    component={NavLink}
                    id="stake-nav"
                    to="/stake"
                    isActive={(match, location) => {
                      return checkPage(match, location, "stake");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={StakeIcon} />
                      <Trans>Stake</Trans>
                    </Typography>
                  </Link>

                  {/* <Link
                    component={NavLink}
                    id="wrap-nav"
                    to="/wrap"
                    isActive={(match, location) => {
                      return checkPage(match, location, "wrap");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Box display="flex" alignItems="center">
                      <SvgIcon component={WrapIcon} color="primary" viewBox="1 0 20 22" />
                      <Typography variant="h6">Wrap</Typography>
                    </Box>
                  </Link> */}

                  <Link
                    component={NavLink}
                    id="bond-nav"
                    to="/bonds"
                    isActive={(match, location) => {
                      return checkPage(match, location, "bonds");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={BondIcon} />
                      <Trans>Bond</Trans>
                    </Typography>
                  </Link>

                  {bonds.filter(b => b.getBondability(networkId)).length > 0 && (
                    <div className="dapp-menu-data discounts">
                      <div className="bond-discounts">
                        <Typography variant="body2">
                          <Trans>Bond discounts</Trans>
                        </Typography>
                        {bonds.map((bond, i) => {
                          if (bond.getBondability(networkId)) {
                            return (
                              <Link component={NavLink} to={`/bonds/${bond.name}`} key={i} className={"bond"}>
                                {!bond.bondDiscount ? (
                                  <Skeleton variant="text" width={"150px"} />
                                ) : (
                                  <Typography variant="body2">
                                    {bond.displayName}

                                    <span className="bond-pair-roi">
                                      {!bond.isBondable[networkId]
                                        ? "Sold Out"
                                        : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`}
                                    </span>
                                  </Typography>
                                )}
                              </Link>
                            );
                          }
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
              {/* : (
                 <>
                   <Link
                     component={NavLink}
                     id="wrap-nav"
                     to="/wrap"
                     isActive={(match, location) => {
                       return checkPage(match, location, "wrap");
                     }}
                     className={`button-dapp-menu ${isActive ? "active" : ""}`}
                   >
                     <Box display="flex" alignItems="center">
                       <SvgIcon component={WrapIcon} color="primary" viewBox="1 0 20 22" />
                       <Typography variant="h6">Wrap</Typography>
                     </Box>
                   </Link>
                 </>
               )} */}
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link, i) => {
              return (
                <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
                  <Typography variant="h6">{externalUrls[link].icon}</Typography>
                  <Typography variant="h6">{externalUrls[link].title}</Typography>
                </Link>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
