// internal imports
import defineStyles from '../../../../styling/defineStyles'

// --- getTabsClasses ------------------------------------------------

const getTabsClasses = defineStyles(theme => ({
  container: {
    padding: '0.5rem 0.75rem',
  },

  title: {
    color: theme.palette.neutralPrimary,
    fontSize: theme.fonts.mediumPlus.fontSize,
    padding: '0 0 1rem 0',
  },

  content: {
    padding: '0 0 0 1rem',
    display: 'flex',
  },

  page: {
    margin: '0.5rem 0 0 0',
  }
}))

// --- exports -------------------------------------------------------

export default getTabsClasses
