// date_format_mmddyyyy( 1684956200679 --> "04/27/2021"
export const date_format_mmddyyyy = (timestamp) => {
    if (!timestamp) {
        return undefined;
    } else {
        const d = new Date(parseInt(timestamp));
        return `${`${1 + d.getMonth()}`.padStart(2, '0')}/${`${d.getDate()}`.padStart(2, '0')}/${d.getFullYear()}`;
    }
}
  