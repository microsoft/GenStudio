import React from 'react';

import { withNamespaces } from 'react-i18next';

function LogoText({ t }) {
  return <h1 className="logo">{t("global.title")}</h1>;
}

export default withNamespaces()(LogoText);
