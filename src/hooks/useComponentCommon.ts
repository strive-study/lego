import { AllComponentProps, TextComponentProps } from '@/defaultProps'
import { pick } from 'lodash-es'
import { computed } from 'vue'

const useComponentCommon = (
  props: Readonly<Partial<AllComponentProps & { isEditing: boolean }>>,
  picks: string[]
) => {
  const styleProps = computed(() => pick(props, picks))
  const handleClick = () => {
    if (props.actionType === 'url' && props.url && !props.isEditing) {
      window.location.href = props.url
    }
  }

  return {
    styleProps,
    handleClick
  }
}

export default useComponentCommon
