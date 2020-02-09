import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';

class DeliveryProblemController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll();

    return res.json(problems);
  }

  async show(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'There is no order with this id.' });
    }

    const problems = await DeliveryProblem.findAll({
      where: {
        order_id: id,
      },
    });

    if (!problems.length > 0) {
      return res.status(400).json({ error: 'There is no problems with this order.' });
    }

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Description field is required.' });
    }

    const { id } = req.params;
    const { description } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'There is no order with this id.' });
    }

    const problem = await DeliveryProblem.create({
      order_id: id,
      description,
    });

    return res.json(problem);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const problem = await DeliveryProblem.findByPk(id);

    if (!problem) {
      return res.status(400).json({ error: 'There is no problem with this id.' });
    }

    const order = await Order.findByPk(problem.order_id);


    if (order.canceled_at) {
      return res.status(400).json({ error: 'Order was already canceled.' });
    }

    order.canceled_at = new Date();
    await order.save();

    return res.json({ message: 'Success! Order has been canceled.' });
  }
}

export default new DeliveryProblemController();
