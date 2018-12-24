import React from 'react'
import Link from 'next/link'

import formatMoney from '../lib/formatMoney'
import Title from './styles/Title'
import ItemStyles from './styles/ItemStyles'
import PriceTag from './styles/PriceTag'
/**
 * @param {object} props
 * @param {object} props.item
 * @param {string} props.item.id
 * @param {string} props.item.title
 * @param {string} props.item.description
 * @param {number} props.item.price
 * @param {string} [props.item.image]
 * @param {string} [props.item.largeImage]
 */
const Item = props => {
  const { item } = props

  return (
    <ItemStyles>
      {item.image ? <img src={item.image} alt={item.title} /> : null}

      <Title>
        <Link
          href={{
            pathname: '/item',
            query: { id: item.id }
          }}
        >
          <a>{item.title}</a>
        </Link>
      </Title>

      <PriceTag>{formatMoney(item.price)}</PriceTag>

      <p>{item.description}</p>

      <div className='buttonList'>
        <Link
          href={{
            pathname: '/update',
            query: { id: item.id }
          }}
        >
          <a>Edit</a>
        </Link>
        <button>Add To Cart</button>
        <button>Delete</button>
      </div>
    </ItemStyles>
  )
}

export default Item
