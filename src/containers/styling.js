const styles = theme => ({
  main: {
    zIndex: '1 !important',
    width: '100%',
    minHeight: '100%',
    marginTop: 0
  },
  root: {
    display: 'flex'
  },
  container: {
    height: 'calc(100vh - 234px)',
  },
  containerFiles: {
    height: 'calc(100vh - 255px)',
  },
  paperRoot: {
    width: '100%',
  },
  content: {
    flexGrow: 1,
    padding: theme ? theme.spacing(1) : '5px'
  },
  textAlignRight: {
    textAlign: 'right'
  },
  movingRight: {
    marginRight: '-14px'
  },
  footer: {
    position: 'fixed',
    width: '100%',
    bottom: '5px'
  },
  colorWhite: {
    color: 'white'
  },
  links: {
    textDecoration: 'none',
    color: 'rgb(0,0,0)'
  },
  centering: {
    width: '100%', textAlign: 'center'
  },
  display: {
    display: 'flex'
  },
  handPointer: {
    cursor: 'pointer'
  },
  bordering: {
    border: '#bdbdbd solid 1px',
    borderRadius: '4px'
  }
});

export default styles;
