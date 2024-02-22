
export function format_theme(str) {
    try {
        // ugly code here... we dont have a good design for themes now.
        // we need to redesign themes management,  try catch everything here to avoid crush in the future 
      new_str = str.charAt(0).toUpperCase() + str.slice(1);
      new_str = new_str.replace(/_/g, ' ')
      return new_str
    } catch(err) {
      return str
    }
  }
