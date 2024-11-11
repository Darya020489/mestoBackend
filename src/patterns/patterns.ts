// const urlPattern =
//   /^(https?|ftp)://(([a-zd]([a-zd-]*[a-zd])?.)+[a-z]{2,}|localhost)(/[-a-zd%_.~+]*)*(?[;&a-zd%_.~+=-]*)?(#[-a-zd_]*)?$/i;
export const urlPattern =
  // eslint-disable-next-line no-useless-escape
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export const emailPattern =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
