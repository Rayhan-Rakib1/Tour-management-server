import  express,{ Application, Request, Response } from "express";
import cors from 'cors'
import { router } from "./app/Routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";


export const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.send('server is running ')
})


app.use(globalErrorHandler)
app.use(notFound);