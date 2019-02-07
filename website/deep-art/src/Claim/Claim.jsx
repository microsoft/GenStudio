import React from 'react';

import { withNamespaces } from 'react-i18next';

function Claim({ t }) {
  return <h1 className="claim">{t("global.claim")}</h1>;
}

export default withNamespaces()(Claim);
