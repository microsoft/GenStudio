import React from 'react';

import { withNamespaces } from 'react-i18next';

import globe from '../images/icon-earth.svg';

/**
 * The Navigational Bar across the top of the page
 */
<<<<<<< HEAD:website/deep-art/src/Footer/Footer.jsx
function NavBar({ t }) {
    return (
      <footer className="footer">
        <p className="footer__description">
          <span>Gen Studio is an experimental collaboration across The Met, Microsoft, and MIT. Learn more about the <a href="https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack/" target="_blank" rel="noopener noreferrer"> collaboration</a> and The Met’s <a href="https://www.metmuseum.org/blogs/now-at-the-met/2019/met-microsoft-mit-art-open-data-artificial-intelligence" target="_blank" rel="noopener noreferrer"> Open Access Program</a>. View the source code <a href="https://github.com/Microsoft/deep-art" target="_blank" rel="noopener noreferrer">here</a>.</span>
          {/* <a className="footer__link footer__link--strong" href={'https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack'} target="_blank" rel="noopener noreferrer">
            {t('global.learn_more')}
          </a> */}
        </p>
        <div className="footer__divider"></div>
        <div className="footer__links">
          <div className="footer__lang">
            <img className="footer__image" src={globe} alt={t('global.lang_eng')} />
            <span className="u-nowrap">{t('global.lang_eng_description_us')}</span>
          </div>
          <div>
            <a className="footer__link" href="https://support.microsoft.com/en-us/contactus" target="_blank" rel="noopener noreferrer">{t('foo.report_abuse')}</a>
          </div>
        </div>
      </footer>
  );
}

export default withNamespaces()(NavBar);
=======
export default class NavBar extends Component{

    render() {
        return(
            <WrapBox>
                <FootBox
                    direction='column'
                    align='center'
                    justify='center'
                    elevation='none'
                    fill='horizontal'
                    style={{alignContent: "space-between"}}
                >
                    <Text size="16px">
                        {"Gen Studio is a prototype concept which was created over a two-day hackathon with collaborators across The Met, Microsoft, and MIT. "} 
                        <Button hoverIndicator={true} href={"https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack"} style={{marginLeft: "5px"}}>
                            <Text size="16px">
                                Click here to learn more.
                            </Text>
                        </Button>
                        <Button hoverIndicator={true} href={"https://go.microsoft.com/fwlink/?LinkId=521839"} style={{marginLeft:"5px"}}>
                            <Text size = "16px">
                                Privacy and Cookies
                            </Text>
                        </Button>
                        {" | "}
                        <Button hoverIndicator={true} href={"https://go.microsoft.com/fwlink/?LinkID=206977"} style={{marginLeft:"5px"}}>
                            <Text size = "16px">
                                Terms of use
                            </Text>
                        </Button>
                    </Text>


                </FootBox>
            </WrapBox>

        );
    }
}
>>>>>>> origin/master:website/src/Footer/Footer.jsx
