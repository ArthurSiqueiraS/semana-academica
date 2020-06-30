export default function(_, inject) {
  function lecture(l) {
    let date = new Date(l.schedule_time)
    const day = `${('0' + date.getDate()).slice(-2)}/${(
      '0' +
      (date.getMonth() + 1)
    ).slice(-2)}`

    const time = `${('0' + (date.getHours() + 1)).slice(-2)}:${(
      '0' + date.getMinutes()
    ).slice(-2)}`

    date = `${date.getUTCFullYear()}-${('0' + (date.getMonth() + 1)).slice(
      -2
    )}-${('0' + date.getDate()).slice(-2)}`

    return {
      id: l.id,
      title: l.title,
      speaker: l.speaker,
      description: l.description,
      date,
      day,
      time: time !== '01:00' ? time : '',
      link: l.link,
      thumbnail: l.thumbnail
    }
  }

  function publication(p) {
    return p
  }

  inject('representers', {
    lecture,
    publication
  })
}
