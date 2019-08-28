// external imports
import React from 'react'
import { css } from 'office-ui-fabric-react' 
import { IoIosApps  as DefaultLogo } from 'react-icons/io'

// internal imports
import defaultBrandProps from '../defaults/defaultBrandProps'
import styleBrand from './styleBrand'
import BrandProps from '../types/BrandProps'

// --- BrandView ----------------------------------------------------

function BrandView(props: BrandAttrs) {
  return styleBrand(classes => {
    const
      size = props.size,
      sizePascalCase = !size ? null : size[0].toUpperCase() + size.substring(1),
      vendorClassName: string = css(classes.vendor, (classes as any)[`vendor${sizePascalCase}`]),
      titleClassName: string = css(classes.title, (classes as any)[`title${sizePascalCase}`]),
      logoClassName: string = css(classes.logo, (classes as any)[`logo${sizePascalCase}`])

    let
      firstColumnContent = null,
      secondColumnContent = null

    if (props.vendor) {
      secondColumnContent =
        <div key="vendor" className={vendorClassName}>
          {props.vendor}
        </div>
    }

    if (props.title) {
      const titleContent =
        <div key="title" className={titleClassName}>
          {props.title}
        </div>

      if (!secondColumnContent) {
        secondColumnContent = titleContent
      } else {
        secondColumnContent =
          <React.Fragment>
            {secondColumnContent}
            {titleContent}
          </React.Fragment>
      }
    }
   
    firstColumnContent =
      <div className={classes.logo}>
        {props.logo  || <DefaultLogo className={logoClassName}/>}
      </div>

    return (
      <div className={props.className} style={props.style}>
        <div className={classes.container}>
          <div className={classes.firstColumn}>
              {firstColumnContent}
          </div>
          <div className={classes.secondColumn}>
            {secondColumnContent}
          </div>
        </div>
      </div>
    )
  })
}

// --- locals -------------------------------------------------------

type BrandAttrs = BrandProps & typeof defaultBrandProps

// --- exports ------------------------------------------------------

export default BrandView
