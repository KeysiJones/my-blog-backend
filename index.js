const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Post = require("./models/Post.js");
const User = require("./models/User.js");
const Counter = require("./models/Counter");
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const generateSequence = require("./config/sequenceGenerator");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const corsOptions = require("./config/corsOptions.js");

app.use(cors(corsOptions));

const connectionUrl =
  process.env.REACT_APP_DATABASE_URL || "mongodb://localhost:27017/post";

mongoose.Promise = global.Promise;

mongoose
  .connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

mongoose.connection.on("error", (err) => {
  throw "failed connect to MongoDB";
});

app.get("/posts", function (req, res) {
  Post.find(function (err, posts) {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.status(200).json(posts);
  });
});

app.get("/posts/:postId", function (req, res) {
  const { postId } = req.params;

  Post.findOne({ id: postId }, function (err, post) {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.status(200).json(post);
  });
});

// app.get("/counters", auth, function (req, res) {
//   Counter.find(function (err, counters) {
//     if (err) {
//       return res.status(500).json({
//         error: err.message,
//       });
//     }

//     res.status(200).json({ counters: counters });
//   });
// });

// app.post("/cadastrar-cursos", auth, function (req, res) {
//   const { terca, quarta, quinta, sabado } = req.body;

//   const aula = new Aula({
//     terca: terca,
//     quarta: quarta,
//     quinta: quinta,
//     sabado: sabado,
//   });

//   aula.save(function (err, aulas) {
//     if (err) {
//       return res.status(500).json({ erro: err.message });
//     }

//     res.status(200).json(aulas);
//   });
// });

// app.post("/novasAulas/:aulasId", auth, function (req, res) {
//   const { diaSemana, novaAula } = req.body;

//   generateSequence("postId")
//     .then((generatedSequence) => {
//       novaAula.id = generatedSequence;
//       Aula.updateOne(
//         { _id: req.params.aulasId },
//         {
//           $push: {
//             [diaSemana]: novaAula,
//           },
//         },
//         function (err, aula) {
//           if (err) {
//             return res.status(500).json({ erro: err.message });
//           }

//           return res.status(200).json(aula);
//         }
//       );
//     })
//     .catch((error) => console.log(error));
// });

// app.delete("/novasAulas/:aulasId", auth, function (req, res) {
//   const { diaSemana, aula } = req.body;

//   generateSequence("postId")
//     .then(() => {
//       Aula.findByIdAndUpdate(
//         { _id: req.params.aulasId },
//         {
//           $pull: {
//             [diaSemana]: {
//               id: aula.id,
//             },
//           },
//         },
//         {
//           multi: true,
//         },
//         function (err, aula) {
//           if (err) {
//             return res.status(500).json({ erro: err.message });
//           }

//           return res.status(200).json(aula);
//         }
//       );
//     })
//     .catch((error) => console.log(error));
// });

// app.get("/aulas/:aulasId", function (req, res) {
//   const aulasId = req.params.aulasId;

//   Aula.findOne({ _id: aulasId }, function (err, aulas) {
//     if (err) {
//       return res.status(500).json({ erro: err.message });
//     }

//     if (aulas == null) {
//       return res.status("404").json({ msg: "Aulas não encontradas !" });
//     }

//     return res.status(200).json(aulas);
//   });
// });

// app.put("/aulas/:aulasId", auth, function (req, res) {
//   const { diaSemana, novasAulas } = req.body;
//   const opcao = `${diaSemana}.id`;
//   const link = `${diaSemana}.$.link`;
//   const nome = `${diaSemana}.$.nome`;
//   const horario = `${diaSemana}.$.horario`;

//   Aula.updateOne(
//     { _id: req.params.aulasId, [opcao]: novasAulas.id },
//     {
//       $set: {
//         [link]: novasAulas.link,
//         [nome]: novasAulas.nome,
//         [horario]: novasAulas.horario,
//       },
//     },
//     function (err, aula) {
//       if (err) {
//         return res.status(500).json({ erro: err.message });
//       }

//       return res.status(200).json(aula);
//     }
//   );
// });

/* *************************************** COMENTADO MAS CONTINUA FUNCIONANDO ********************************************** */

// app.delete("/post/:postId", auth, (req, res) => {
//   const postId = req.params.postId;

//   Post.deleteOne({ id: postId }, function (err, post) {
//     if (err) {
//       return res.status(500).json({ erro: err.message });
//     }

//     if (post == null) {
//       return res.status("404").json({ msg: "Post não encontrado !" });
//     }

//     return res.status(200).json({ msg: "Post deletado com sucesso" });
//   });
// });

// Register
// ...

// app.post("/register", async (req, res) => {
//   // Our register logic starts here
//   try {
//     // Get user input
//     const { username, password } = req.body;

//     // Validate user input
//     if (!(password && username)) {
//       res.status(400).send("All input is required");
//     }

//     // check if user already exist
//     // Validate if user exist in our database
//     const oldUser = await User.findOne({ username });

//     if (oldUser) {
//       return res.status(409).send("User Already Exist. Please Login");
//     }

//     //Encrypt user password
//     encryptedPassword = await bcrypt.hash(password, 10);

//     // Create user in our database
//     const user = await User.create({
//       username: username,
//       password: encryptedPassword,
//     });

//     // Create token
//     const token = jwt.sign(
//       { user_id: user._id, username: username },
//       process.env.TOKEN_KEY,
//       {
//         expiresIn: "1d",
//       }
//     );
//     // save user token
//     user.token = token;

//     // return new user
//     res.status(201).json(user);
//   } catch (err) {
//     console.log(err);
//   }
//   // Our register logic ends here
// });

// Login
app.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { password, username } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user._id }, process.env.TOKEN_KEY, {
        expiresIn: "1d",
      });

      // save user token
      user.token = token;
      const message = "Login realizado com sucesso";

      const status = 200;
      res.status(status).json({ status, token, message });
    }

    res.status(400).send({ message: "Usuário e/ou senha inválidos" });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.listen(PORT, () => console.log("programa iniciou"));
