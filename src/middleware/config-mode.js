import { getNav } from "../utils/index.js";

const configMode = async (req, res, next) => {
  res.locals.scripts = res.locals.scripts || [];
  res.locals.styles = res.locals.styles || [];
  res.locals.navHTML = await getNav();

  if (process.env.NODE_ENV === "development") {
    // Add livereload scripta
    res.locals.scripts.push(`
      <script>
        const ws = new WebSocket('ws://127.0.0.1:${parseInt(port) + 1}');
        ws.onclose = () => {
            setTimeout(() => location.reload(), 2000);
        };
      </script>   
    `);
  }

  next();
};

export default configMode;
