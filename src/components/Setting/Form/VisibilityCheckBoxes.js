import React from 'react'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { isEmpty, intersection } from 'lodash'
import { PAGE_TYPE } from 'constants'
import useSettingStore from 'stores/setting'

import BlockTitle from './BlockTitle'

const VISIBLE_PAGE_TYPE_OPTIONS = [
  { text: 'Code', disabled: true, checked: true },
  { text: 'Pull requests', disabled: true, checked: true },
  { text: 'Issues', values: [PAGE_TYPE.ISSUES] },
  { text: 'Others (Discussions, Wiki, ...)', values: [PAGE_TYPE.OTHERS] },
]

const VisibilityCheckBoxes = () => {
  const disablePageTypeList = useSettingStore((s) => s.disablePageTypeList) ?? []
  const dispatch = useSettingStore((s) => s.dispatch)

  return (
    <>
      <BlockTitle>Show A-Tree on</BlockTitle>
      <Grid container alignItems="center">
        {VISIBLE_PAGE_TYPE_OPTIONS.map(
          ({ text, disabled, checked, values }) => {
            const isChecked =
              checked || isEmpty(intersection(values, disablePageTypeList))

            const handleChange = () => {
              values.forEach((pageType) => {
                if (disablePageTypeList?.includes(pageType)) {
                  dispatch({
                    type: 'UPDATE_DISABLE_PAGE_TYPE_LIST',
                    payload: disablePageTypeList.filter(
                      (type) => type !== pageType
                    ),
                  })
                } else {
                  dispatch({
                    type: 'UPDATE_DISABLE_PAGE_TYPE_LIST',
                    payload: [...disablePageTypeList, pageType],
                  })
                }
              })
            }

            return (
              <Grid item xs={12} key={text}>
                <FormControlLabel
                  disabled={Boolean(disabled)}
                  control={
                    <Checkbox
                      name={text}
                      color="primary"
                      checked={isChecked}
                      onChange={handleChange}
                    />
                  }
                  label={text}
                />
              </Grid>
            )
          }
        )}
      </Grid>
    </>
  )
}

export default VisibilityCheckBoxes
