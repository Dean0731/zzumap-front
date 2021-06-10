export function changeTagList(records) {
  for (let i = 0; i < records.length; i++) {
    if (records[i].tag !== null) {
      records[i].tag = getTagLabelValue(records[i].tag)
    }
  }
  return records
}
export function changeTag(record) {
  record.tag = getTagLabelValue(record.tag)
  console.log(record)
  return record
}
function getTagLabelValue(tagStr) {
  const str = tagStr.split(',')
  const tag = []
  for (let j = 0; j < str.length; j++) {
    tag.push({ name: str[j], type: type[j % 4] })
  }
  return tag
}
const type = ['success', 'warning', 'info', 'danger']
