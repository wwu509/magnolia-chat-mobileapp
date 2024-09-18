import React, {memo} from 'react';
import {Trans, useTranslation} from 'react-i18next';

type TranslateProps = {
  value: string;
  ns: string;
  dynamicValue?: any;
};

const Translate = ({value, ns, dynamicValue}: TranslateProps) => {
  const {t} = useTranslation();

  return <Trans t={t} i18nKey={value} ns={ns} values={dynamicValue} />;
};

export default memo(Translate);
