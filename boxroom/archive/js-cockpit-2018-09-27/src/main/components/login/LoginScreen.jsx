import React from 'react';
import { defineComponent, isNode, isElementsOf } from 'js-scenery/react';
import { Seq } from 'js-seq';
import Color from 'color';

import Css from '../styling/Css';

function getStyles({ theme }) {
  const
    gradientStartColor = Color(theme.palette.themePrimary).lighten(0.2).desaturate(0.4),
    gradientEndColor = Color(theme.palette.themePrimary).darken(0.2).desaturate(0.4);

  return {
    outerContainer: {
      position: 'absolute',
      display: 'block',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      backgroundImage: `linear-gradient(120deg, ${gradientStartColor}, ${gradientEndColor})`
    },

    innerContainer: {
      position: 'relative',
      display: 'inline-block',
      textAlign: 'center',
      verticalAlign: 'middle',
      left: '50%',
      right: '50%',
      top: '30%',
      bottom: '50%',
      transform: 'translate(-50%, -30%)'
    }
  };
}

const LoginScreen = defineComponent({
  displayName: 'LoginScreen',

  properties: {
    children: {
      constraint: it => isElementsOf([LoginScreen.Main], it),
      nullable: true,
      defaultValue: null
    }
  },

  render({ children }) {
    let mainContent = null;

    Seq.adjust(children).forEach(({ type, props }) => {
      const content =
        <div className={props.className} style={props.style}>
          {props.children}
        </div>;

      if (type === LoginScreen.Main) {
        mainContent = content;
      }
    });

    return (
      <Css getStyles={getStyles}>
        {classes => 
          <div className={classes.outerContainer}>
            <div className={classes.innerContainer}>
              {mainContent}
            </div>
          </div>
        }
      </Css>
    );
  }
});

LoginScreen.Main = defineComponent({
  displayName: 'LoginScreen.Main',

  properties: {
    className: {
      type: String,
      nullable: true,
      defaultValue: null
    },

    styles: {
      type: Object,
      nullable: true,
      defaultValue: null
    },

    children: {
      constraint: isNode,
      nullable: true,
      defaultValue: null
    }
  },

  render() {
    throw new Error('Components of type LoginScreen.Main can only be '
      + 'used as children of LoginScreen');
  }
});

export default LoginScreen;
