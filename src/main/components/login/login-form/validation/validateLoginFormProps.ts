// external imports
import { isNode } from 'js-react-utils'
import { Spec } from 'js-spec'

// --- validateLoginFormProps ----------------------------------------

const validateLoginFormProps = Spec.checkProps({
  optional: {
    performLogin:
      Spec.nullable(Spec.function),
    
    fullSize:
      Spec.boolean,

    extraFields:
      Spec.arrayOf(
        Spec.and(
          Spec.prop('type', Spec.oneOf('text', 'choice')),

        Spec.or(
          {
            when: Spec.prop('type', Spec.is('text')),

            then:
              Spec.exact({
                type: Spec.is('text'),
                name: Spec.string,
                label: Spec.string,
                defaultValue: Spec.optional(Spec.string)
              })
          },
          {
            when: Spec.prop('type', Spec.is('choice')),

            then:
                Spec.exact({
                type: Spec.is('choice'),
                name: Spec.string,
                label: Spec.string,
                defaultValue: Spec.string,

                options: Spec.arrayOf(
                    Spec.exact({
                      value: Spec.string,
                      text: Spec.string
                    })
                )
              })
          })
        )),
    
    slotIntro: isNode,
    slotHeader: isNode,
    slotFooter: isNode
  }
})

// --- exports -------------------------------------------------------

export default validateLoginFormProps
