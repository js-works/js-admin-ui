// external imports
import Color from 'color'

// internal imports
import defineStyles from '../../../../styling/defineStyles'
import CockpitProps from '../types/CockpitProps'

// --- styleCockpit --------------------------------------------------

const getCockpitClasses = defineStyles((theme, look: CockpitProps['look'])  => {
  const
    menu = look !== 'default'
      ? null
      : {
          selectors: {
            '& > [data-component=MenuBar]': {
              backgroundColor: '#f0f0f0 !important',
              marginBottom: '1px',

              selectors: {
                '*': {
                  border: 'none !important',
                  background: 'none !important',
                }
              }
            }
          }
        }

  return {
    root: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minWidth: '100%',
      height: '100%',
      maxHeight: '100%',
      justifyContent: 'stretch',
    },

    header: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      height: '46px',
      minWidth: '100%',
      color: '#f0f0f0',
      backgroundColor: look === 'bright' ? theme.palette.themeDark : 'rgb(68, 68, 68)',
      zIndex: 32000
    },

    headerStart: {
      padding: '0.1rem 0.5rem',
      whiteSpace: 'nowrap',
    },

    headerCenter: {
      flexGrow: 1,
      padding: '0 2rem 0.2rem 4rem',
      whiteSpace: 'nowrap',

      selectors: {
        '& > [data-component=AppMenu] [data-component="AppMenu:inner"]': {
          paddingTop: '5px',
        },
  
        '& > [data-component=AppMenu] .ms-Pivot-text': {
          color: theme.palette.white,
        },
        
        '& > [data-component=AppMenu] *:hover *': {
          backgroundColor: 'transparent',
        },

        '& > [data-component=MenuBar] [data-component="MenuBar:icon"]': {
          display: 'block !important',
        },
        
        '& > [data-component=MenuBar] [data-component="MenuBar:icon"] *': {
          color: theme.palette.themeSecondary + ' !important',
        },

        '& > [data-component=MenuBar] *': {
           color: theme.palette.white + ' !important',
           backgroundColor: 'transparent !important',
           borderStyle: 'hidden !important',
        }
      }
    },

    headerEnd: {
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',

      selectors: {
        '& > div': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },

        '& > *': {
          marginLeft: '0.9rem'
        }
      }
    },

    menu,

    content: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
    },

    sidebar: {
      display: 'flex',

      selectors: {
        '> div': {
          flexGrow: 1
        }
      }
    },

    center: {
      flexGrow: 1,
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'stretch',

      selectors: {
        '> div': {
          flexGrow: 1
        }
      }
    },

  }
})

// --- exports -------------------------------------------------------

export default getCockpitClasses
