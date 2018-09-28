import React from 'react'
import { defineComponent } from 'js-react-utils'

export default defineComponent({
  displayName: 'DefaultAppIcon',

  render() {
    return ( 
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
        <g fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10">
          <path d="M32 1h-6v9l-6 2-6-6-8 8 6 6-2 6H1v12h9l2 6-6 6 8 8 6-6 6 2v9h12v-9l6-2 6 6 8-8-6-6 2-6h9V26h-9l-2-6 6-6-8-8-6 6-6-2V1z"/>
          <circle cx="32" cy="32" r="6"/>
        </g>
      </svg>
    )
  }
})
