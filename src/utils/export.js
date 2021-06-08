export function exportToExcel(list, filterVal) {
  import('@/vendor/Export2Excel').then(excel => {
    const data = formatJson(list, filterVal)
    excel.export_json_to_excel({
      header: filterVal,
      data,
      filename: 'table-list'
    })
  })
}

function formatJson(list,filterVal) {
  return list.map(v => filterVal.map(j => {
    return v[j]
  }))
}
