import router from '@ombiel/aek-devserver/router';

router.get('/', (req, res) => {
  res.render('welcome-pack');
});

export default router;